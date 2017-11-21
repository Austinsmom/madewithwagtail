from wagtail.wagtailforms.models import AbstractFormField, AbstractEmailForm
from wagtail.wagtailadmin.edit_handlers import FieldPanel, InlinePanel, MultiFieldPanel
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailforms.forms import FormBuilder

from modelcluster.fields import ParentalKey
from wagtailcaptcha.forms import WagtailCaptchaFormBuilder
from wagtailcaptcha.models import WagtailCaptchaEmailForm

from core.utilities import has_recaptcha


class SubmitFormBuilder(WagtailCaptchaFormBuilder if has_recaptcha() else FormBuilder):
    def get_form_class(self):
        form_class = super(SubmitFormBuilder, self).get_form_class()
        form_class.required_css_class = 'required'
        return form_class


class SubmitFormField(AbstractFormField):
    page = ParentalKey('SubmitFormPage', related_name='form_fields')


class SubmitFormPage(WagtailCaptchaEmailForm if has_recaptcha() else AbstractEmailForm):
    """
    Form page, inherits from WagtailCaptchaEmailForm if available, otherwise fallback to AbstractEmailForm
    """

    def __init__(self, *args, **kwargs):
        super(SubmitFormPage, self).__init__(*args, **kwargs)

        # WagtailCaptcha does not respect cls.form_builder and overwrite with its own.
        # See https://github.com/springload/wagtail-django-recaptcha/issues/7 for more info.
        self.form_builder = SubmitFormBuilder

    parent_types = ['core.HomePage']
    subpage_types = []

    search_fields = []
    body = RichTextField(blank=True, help_text='Edit the content you want to see before the form.')
    thank_you_text = RichTextField(blank=True, help_text='Set the message users will see after submitting the form.')

    class Meta:
        verbose_name = "Form Page"
        description = "Page with the form to submit a new Wagtail site"


SubmitFormPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('body', classname="full"),
    FieldPanel('thank_you_text', classname="full"),
    InlinePanel('form_fields', label="Form fields"),
    MultiFieldPanel([
        FieldPanel('to_address'),
        FieldPanel('from_address'),
        FieldPanel('subject'),
    ], "Email notification")
]
